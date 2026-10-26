// components/ClientLogger.tsx
'use client';

import { useEffect } from 'react';

export default function ClientLogger({ data, label = 'Data Log' }: { data: any; label?: string }) {
    console.log(data);
    useEffect(() => {
        // This runs exclusively in the browser console
        console.group(`🚀 Client View: ${label}`);
        console.groupEnd();
    }, [data, label]);

    return null; // This component doesn't render any UI
}