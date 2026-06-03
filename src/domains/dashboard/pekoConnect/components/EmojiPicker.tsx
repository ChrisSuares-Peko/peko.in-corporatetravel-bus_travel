import React, { Suspense } from 'react';

import { Grid, Spin } from 'antd';

const EmojiPickerReact = React.lazy(() => import('emoji-picker-react'));

type EmojiPanelProps = {
    onEmojiClick: (emoji: any) => void;
};

const { useBreakpoint } = Grid;

export default function EmojiPicker({ onEmojiClick }: EmojiPanelProps) {
    const screen = useBreakpoint();
    return (
        <Suspense
            fallback={
                <div className="size-32 flex justify-center items-center">
                    <Spin />
                </div>
            }
        >
            <EmojiPickerReact
                width={screen.md ? 350 : 260}
                height={screen.md ? 450 : 350}
                lazyLoadEmojis
                onEmojiClick={onEmojiClick}
            />
        </Suspense>
    );
}
