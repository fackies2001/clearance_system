export default function ProfileHeaderBanner({ user, avatarPreview, onAvatarChange, avatarInput, errors }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
            <button
                type="button"
                onClick={() => avatarInput.current.click()}
                className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0 group"
            >
                {(avatarPreview || user.avatar_url) ? (
                    <img
                        src={avatarPreview || user.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </button>

            <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0f172a] text-base truncate">{user.name}</p>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                <button
                    type="button"
                    onClick={() => avatarInput.current.click()}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 mt-1"
                >
                    Change photo
                </button>
                <input
                    type="file"
                    ref={avatarInput}
                    onChange={onAvatarChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                />
                {errors?.avatar && (
                    <p className="text-red-600 text-xs mt-1">{errors.avatar}</p>
                )}
            </div>
        </div>
    );
}