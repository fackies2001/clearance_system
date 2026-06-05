<?php

namespace App\Mail;

use App\Models\Clearance;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClearanceReadyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $clearance;

    /**
     * Create a new message instance.
     */
    public function __construct(Clearance $clearance)
    {
        $this->clearance = $clearance;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your NBI Clearance is Ready - ' . $this->clearance->clearance_number,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.clearance-ready',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
