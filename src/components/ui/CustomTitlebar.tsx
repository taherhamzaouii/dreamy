import React from 'react';
import { WindowTitlebar } from 'tauri-controls';

export const CustomTitlebar: React.FC = () => {

    return (
        <WindowTitlebar
            controlsOrder="left"
            windowControlsProps={{
                platform: "macos",
                justify: false,
            }}
            className="fixed top-0 left-0 right-0 h-8 z-50 rounded-t-xl"
        />
    );
};
