<div class="mt-6 border-t border-gray-200 pt-6">
    <h3 class="text-md font-semibold text-gray-700 flex items-center gap-2 mb-4">
        📷 Biometric & Photo Capture
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div
            class="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center min-h-[320px]">
            <div
                class="w-full max-w-[320px] h-[240px] bg-white border border-gray-300 rounded mb-4 flex items-center justify-center">
                <span class="text-gray-400 text-sm">Webcam Feed Preview</span>
            </div>
            <button type="button"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition">
                Capture Photo
            </button>
        </div>

        <div x-data="{ scanning: false, scanned: false }"
            class="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center min-h-[320px]">
            <div
                class="w-full max-w-[320px] h-[240px] bg-white border border-gray-300 rounded mb-4 flex flex-col items-center justify-center p-4 relative overflow-hidden">

                <div x-show="!scanning && !scanned" class="text-center flex flex-col items-center">
                    <svg class="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a5 5 0 00-10 0c0 .353.039.697.115 1.028A13.93 13.93 0 003 17l.033.064m16.342 1.946A13.973 13.973 0 0020 11a10 10 0 00-19.957-.93M21.787 15.11a13.974 13.974 0 01-1.787 4.46m3.456-2.011A13.921 13.921 0 0021 11a5 5 0 00-5 5c0 .324.031.64.091.946">
                        </path>
                    </svg>
                    <span class="text-sm text-gray-500 font-medium">Scanner Status: <span
                            class="text-amber-500 font-bold">Ready</span></span>
                    <p class="text-xs text-gray-400 mt-1">Place applicant's thumb on the device</p>
                </div>

                <div x-show="scanning" x-cloak class="text-center flex flex-col items-center w-full">
                    <div class="relative inline-block">
                        <svg class="w-16 h-16 text-blue-500 animate-pulse" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a5 5 0 00-10 0c0 .353.039.697.115 1.028A13.93 13.93 0 003 17l.033.064m16.342 1.946A13.973 13.973 0 0020 11a10 10 0 00-19.957-.93M21.787 15.11a13.974 13.974 0 01-1.787 4.46m3.456-2.011A13.921 13.921 0 0021 11a5 5 0 00-5 5c0 .324.031.64.091.946">
                            </path>
                        </svg>
                        <div class="absolute inset-x-0 h-0.5 bg-blue-500 shadow-md top-1/2 animate-bounce"></div>
                    </div>
                    <span class="text-sm text-blue-600 font-semibold mt-2">Scanning fingerprint...</span>
                </div>

                <div x-show="scanned" x-cloak class="text-center flex flex-col items-center">
                    <svg class="w-16 h-16 text-green-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7">
                        </path>
                    </svg>
                    <span
                        class="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">SCAN
                        SUCCESSFUL</span>
                    <p class="text-[11px] text-gray-400 mt-1 font-mono">Template: FP-MOCK-OK</p>
                </div>

            </div>

            <div class="flex items-center gap-3">
                <button
                    x-on:click="scanning = true; scanned = false; setTimeout(() => { scanning = false; scanned = true; }, 2000)"
                    x-bind:disabled="scanning" type="button"
                    class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition">
                    Scan Fingerprint
                </button>
                <button x-show="scanned" x-on:click="scanned = false; scanning = false" x-cloak type="button"
                    class="text-xs text-gray-500 hover:text-red-500 transition underline">
                    Reset
                </button>
            </div>
        </div>

    </div>
</div>

<div class="mt-6 flex justify-end">
    <button type="submit"
        class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition">
        Submit Application
    </button>
</div>
