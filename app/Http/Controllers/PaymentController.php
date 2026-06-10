<?php

namespace App\Http\Controllers;

use App\Models\Clearance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    // Show payment selection page
    public function show($tracking_no)
    {
        if ($tracking_no === 'LATEST') {
            $latest = Clearance::where('user_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->first();
            
            if (!$latest) {
                return redirect()->route('apply.form')->with('error', 'Please submit an application first.');
            }
            
            return redirect()->route('payment.show', $latest->tracking_no);
        }

        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', auth()->id()) // Security check
            ->firstOrFail();

        // If already paid, redirect to receipt
        if ($clearance->payment_status === 'paid') {
            return redirect()->route('payment.receipt', $tracking_no);
        }

        return Inertia::render('Payment/PaymentSelection', [
            'clearance' => [
                'tracking_no'    => $clearance->tracking_no,
                'full_name'      => $clearance->full_name,
                'purpose'        => $clearance->purpose,
                'payment_status' => $clearance->payment_status,
                'payment_amount' => $clearance->payment_amount,
            ],
            'flash' => [
                'error' => session('error'),
            ],
        ]);
    }

    // Process the selected payment method
    public function process(Request $request, $tracking_no)
    {
        $request->validate([
            'payment_method' => 'required|in:gcash,maya,bank_transfer,walkin',
        ]);

        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($clearance->payment_status === 'paid') {
            return redirect()->route('payment.receipt', $tracking_no);
        }

        $reference = 'NBI-' . strtoupper(Str::random(8));

        // ── WALK-IN FLOW ──────────────────────────────────────────
        if ($request->payment_method === 'walkin') {
            $clearance->update([
                'payment_method'    => 'walkin',
                'payment_reference' => $reference,
                'payment_status'    => 'pending_walkin',
            ]);

            Log::info("Walk-in payment registered", [
                'tracking_no' => $tracking_no,
                'reference'   => $reference,
                'ip'          => $request->ip(),
            ]);

            return redirect()->route('payment.walkin.pending', $tracking_no);
        }
        // ──────────────────────────────────────────────────────────

        // Online payment methods (gcash, maya, bank_transfer)
        $clearance->update([
            'payment_method'    => $request->payment_method,
            'payment_reference' => $reference,
            'payment_status'    => 'pending_payment',
        ]);

        Log::info("Payment initiated", [
            'tracking_no' => $tracking_no,
            'method'      => $request->payment_method,
            'reference'   => $reference,
            'ip'          => $request->ip(),
        ]);

        return redirect()->route('payment.checkout', $tracking_no);
    }

    // Mock checkout page (simulate payment)
    public function checkout($tracking_no)
    {
        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', auth()->id()) // Security check
            ->firstOrFail();

        // Guard: must have selected a payment method first
        if (!$clearance->payment_method) {
            return redirect()->route('payment.show', $tracking_no);
        }

        // Guard: already paid
        if ($clearance->payment_status === 'paid') {
            return redirect()->route('payment.receipt', $tracking_no);
        }

        return Inertia::render('Payment/MockCheckout', [
            'clearance' => [
                'tracking_no'       => $clearance->tracking_no,
                'full_name'         => $clearance->full_name,
                'payment_method'    => $clearance->payment_method,
                'payment_reference' => $clearance->payment_reference,
                'payment_amount'    => $clearance->payment_amount,
            ],
        ]);
    }

    // Simulate payment success
    public function success($tracking_no)
    {
        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', auth()->id()) // Security check
            ->firstOrFail();

        // Idempotency — prevent double success
        if ($clearance->payment_status === 'paid') {
            return redirect()->route('payment.receipt', $tracking_no);
        }

        $clearance->update([
            'payment_status'  => 'paid',
            'paid_at'         => now(),
            'workflow_status' => 'pending',
            'status'          => 'pending',
        ]);

        \Illuminate\Support\Facades\Log::info("Payment SUCCESS (simulated)", [
            'tracking_no' => $tracking_no,
            'reference'   => $clearance->payment_reference,
            'amount'      => $clearance->payment_amount,
        ]);

        // Notify User
        \App\Models\Notification::create([
            'user_id' => $clearance->user_id,
            'type'    => 'payment_confirmed',
            'title'   => 'Payment Confirmed!',
            'message' => "Your payment for NBI Clearance ({$tracking_no}) has been successfully processed. You may now schedule your appointment.",
            'link'    => route('appointment.index'),
        ]);

        // Notify Admins
        \App\Models\Notification::notifyAdmins(
            'payment_received',
            'New Payment Received',
            "Applicant {$clearance->first_name} {$clearance->last_name} has paid ₱" . number_format($clearance->payment_amount, 2),
            route('admin.transactions.index')
        );

        return redirect()->route('payment.receipt', $tracking_no);
    }

    // Simulate payment failed
    public function failed($tracking_no)
    {
        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', auth()->id()) // Security check
            ->firstOrFail();

        // Don't allow marking paid transaction as failed
        if ($clearance->payment_status === 'paid') {
            return redirect()->route('payment.receipt', $tracking_no);
        }

        $clearance->update([
            'payment_status' => 'failed',
        ]);

        Log::warning("Payment FAILED (simulated)", [
            'tracking_no' => $tracking_no,
            'reference'   => $clearance->payment_reference,
        ]);

        return redirect()->route('payment.show', $tracking_no)
            ->with('error', 'Payment failed. Please try again or select a different payment method.');
    }

    // Receipt page
    public function receipt($tracking_no)
    {
        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', auth()->id()) // Security check
            ->firstOrFail();

        // Guard: only show receipt if actually paid
        if ($clearance->payment_status !== 'paid') {
            return redirect()->route('payment.show', $tracking_no);
        }

        return Inertia::render('Payment/Receipt', [
            'clearance' => [
                'tracking_no'       => $clearance->tracking_no,
                'full_name'         => $clearance->full_name,
                'purpose'           => $clearance->purpose,
                'payment_method'    => $clearance->payment_method,
                'payment_reference' => $clearance->payment_reference,
                'payment_amount'    => $clearance->payment_amount,
                'paid_at'           => $clearance->paid_at,
            ],
        ]);
    }

    // Walk-in pending page
    public function walkinPending($tracking_no)
    {
        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if (!in_array($clearance->payment_status, ['pending_walkin', 'paid'])) {
            return redirect()->route('payment.show', $tracking_no);
        }

        return Inertia::render('Payment/WalkinPending', [
            'clearance' => [
                'tracking_no'       => $clearance->tracking_no,
                'full_name'         => $clearance->full_name,
                'purpose'           => $clearance->purpose,
                'payment_reference' => $clearance->payment_reference,
                'payment_amount'    => $clearance->payment_amount,
                'payment_status'    => $clearance->payment_status,
            ],
        ]);
    }
}
