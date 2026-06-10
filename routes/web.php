<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Clearance;
use App\Models\Notification;
use App\Http\Controllers\ClearanceController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Admin\ApplicationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ClearanceProcessingController;
use App\Http\Controllers\Admin\HitVerificationController;
use App\Http\Controllers\Admin\ReportsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\WalkinPaymentController;
use App\Http\Controllers\Admin\BiometricsCaptureController;
use App\Http\Controllers\Admin\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});


// ─── TWO FACTOR AUTHENTICATION ROUTES ───
Route::middleware(['auth'])->group(function () {
    Route::get('/two-factor', [App\Http\Controllers\TwoFactorController::class, 'index'])->name('two-factor.index');
    Route::post('/two-factor/verify', [App\Http\Controllers\TwoFactorController::class, 'verify'])->name('two-factor.verify');
    Route::post('/two-factor/resend', [App\Http\Controllers\TwoFactorController::class, 'resend'])->name('two-factor.resend');
});

// ─── USER & COMMON AUTHENTICATED ROUTES ───
Route::middleware(['auth', 'two-factor'])->group(function () {
    
    Route::get('/dashboard', function () {
        return redirect()->route('application.status');
    })->name('dashboard');

    // Application Status
    Route::get('/application-status', function () {
        $clearances = Clearance::where('user_id', auth()->id())
            ->with('appointment') // eager load
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Application/Status', [
            'clearances' => $clearances
        ]);
    })->name('application.status');

    // Clearance Release
    Route::get('/clearance/{tracking_no}/view', [ClearanceController::class, 'viewClearance'])->name('clearance.view');
    Route::get('/clearance/{tracking_no}/download', [ClearanceController::class, 'downloadClearance'])->name('clearance.download');

    // Application Form
    Route::get('/apply', function () {
        $existing = auth()->user()->role === 'admin' ? null : 
            \App\Models\Clearance::where('user_id', auth()->id())
                ->whereNotIn('workflow_status', ['released', 'rejected'])
                ->whereNotIn('payment_status', ['paid'])
                ->first();

        // Latest clearance para sa pre-fill (kahit released/rejected)
        $latestClearance = \App\Models\Clearance::where('user_id', auth()->id())
            ->latest()
            ->first();

        return Inertia::render('Clearance/Apply', [
            'existingClearance' => $existing,
            'latestClearance'   => $latestClearance,
        ]);
    })->name('apply.form');
    
    Route::post('/apply', [ClearanceController::class, 'store'])->name('apply.submit');

    // Appointments (User)
    Route::get('/appointment', [AppointmentController::class, 'index'])->name('appointment.index');
    Route::get('/appointment/slots', [AppointmentController::class, 'getSlots'])->name('appointment.slots');
    Route::post('/appointment', [AppointmentController::class, 'store'])->name('appointment.store');
    Route::delete('/appointment/{appointment}', [AppointmentController::class, 'cancel'])->name('appointment.cancel');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Add this lightweight inline route here to mark a specific notification row as read safely
    Route::post('/admin/notifications/{id}/read', function ($id) {
        $notification = Notification::find($id);
        if ($notification && !$notification->read_at) {
            $notification->update(['read_at' => now()]);
        }
        return back(); // Refreshes the backend data states without a full layout page reload
    })->name('admin.notifications.read');
});

// ─── RATE-LIMITED PAYMENT CHANNELS ───
Route::middleware(['auth', 'verified', 'two-factor', 'throttle:30,1'])->prefix('payment')->group(function () {
    Route::get('/{tracking_no}', [PaymentController::class, 'show'])->name('payment.show');
    Route::post('/{tracking_no}/process', [PaymentController::class, 'process'])->name('payment.process');
    Route::get('/{tracking_no}/checkout', [PaymentController::class, 'checkout'])->name('payment.checkout');
    Route::post('/{tracking_no}/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::post('/{tracking_no}/failed', [PaymentController::class, 'failed'])->name('payment.failed');
    Route::get('/{tracking_no}/receipt', [PaymentController::class, 'receipt'])->name('payment.receipt');
    Route::get('/{tracking_no}/walkin-pending', [PaymentController::class, 'walkinPending'])->name('payment.walkin.pending'); // ← DAGDAG
});

// ─── ADMIN ONLY PRIVILEGED CONTROL MODULE ROUTES ───
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {

    // Workflow Processing
    Route::get('/walkin-payment', [WalkinPaymentController::class, 'index'])->name('admin.walkin.index');
    Route::match(['get', 'post'], '/walkin-payment/search', [WalkinPaymentController::class, 'search'])->name('admin.walkin.search');
    Route::post('/walkin-payment/{clearance}/pay', [WalkinPaymentController::class, 'markAsPaid'])->name('admin.walkin.pay');

    Route::get('/biometrics-capture', [BiometricsCaptureController::class, 'index'])->name('admin.biometrics.index');
    Route::post('/biometrics-capture/search', [BiometricsCaptureController::class, 'search'])->name('admin.biometrics.search');
    Route::match(['get', 'post'], '/biometrics-capture/{clearance}/update', [BiometricsCaptureController::class, 'update'])->name('admin.biometrics.update');
    Route::post('/biometrics-capture/{clearance}/store', [BiometricsCaptureController::class, 'store'])->name('admin.biometrics.store');

    // Core Dashboard Analytics Panel
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Biometrics Storage Mapping
    Route::post('/applications/{id}/biometrics', [ApplicationController::class, 'storeBiometrics'])->name('admin.applications.biometrics');

   // User Directory Administration
    Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');

    // Appointments (Admin)
    Route::get('/appointments', [AdminAppointmentController::class, 'index'])->name('admin.appointments.index');
    Route::patch('/appointments/{appointment}/status', [AdminAppointmentController::class, 'updateStatus'])->name('admin.appointments.update-status');

    // Clearance Processing Pipeline Engine
    Route::get('/clearance-processing', [ClearanceProcessingController::class, 'index'])->name('admin.clearance.index');
    Route::patch('/clearance-processing/{id}/status', [ClearanceProcessingController::class, 'updateStatus'])->name('admin.clearance.update-status');
    Route::post('/clearance-processing/{id}/mark-paid', [ClearanceProcessingController::class, 'markAsPaid'])->name('admin.clearance.mark-paid');

    // Hit Verification & Matching Resolution Core
    Route::get('/hit-verification', [HitVerificationController::class, 'index'])->name('admin.hit.index');
    Route::patch('/hit-verification/{id}/resolve', [HitVerificationController::class, 'resolve'])
        ->middleware('password.confirm')
        ->name('admin.hit.resolve');

    // Role changes — need din ng re-auth
    Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])
        ->middleware('password.confirm')
        ->name('admin.users.update-role');

        // Admin can delete users
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
    ->name('admin.users.destroy');

    // Administrative Accounting Logs & Metrics Reporting
    Route::get('/reports', [ReportsController::class, 'index'])->name('admin.reports.index');
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('admin.audit.index');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('admin.transactions.index');
});

require __DIR__ . '/auth.php';