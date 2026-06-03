import { Popover } from 'antd';
import { ReactSVG } from 'react-svg';

import Smile from '@domains/dashboard/pekoConnect/assets/EmojiIcon.svg';

import EmojiPicker from './EmojiPicker';

type EmojiPanelProps = {
    onEmojiClick: (emoji: any) => void;
};

export default function EmojiPanel({ onEmojiClick }: EmojiPanelProps) {
    return (
        <Popover
            placement="topLeft"
            title=""
            content={<EmojiPicker onEmojiClick={onEmojiClick} />}
            className="rounded-xl"
            trigger="click"
        >
            <ReactSVG src={Smile} className="cursor-pointer" />
        </Popover>
    );
}
