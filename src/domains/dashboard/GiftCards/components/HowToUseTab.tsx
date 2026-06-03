import { Flex, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

type Props = {
    text?: string;
};

function HowToUseTab({ text }: Props) {
    const sanitizeHTML = (html: string): string => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    const sanitizedText = text ? sanitizeHTML(text) : '';

    return (
        <Content>
            <Flex>
                <Typography.Paragraph className=" text-neutral-500 text-xs font-normal leading-loose tracking-wider">
                    {sanitizedText}
                </Typography.Paragraph>
            </Flex>
        </Content>
    );
}

export default HowToUseTab;
