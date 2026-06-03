import LinkedinLogo from '../assets/icons/LinkedIn - Negative.svg';
import FacebookLogo from '../assets/icons/Vector.svg';
import whatsappLogo from '../assets/icons/whatsapp.svg';
import XLogo from '../assets/icons/x-logo.svg';

export const socialPaths = [
    {
        icon: FacebookLogo,
        path: 'https://www.facebook.com/sharer/sharer.php?u=', // Facebook uses the URL, but we will include the message in the description
    },
    {
        icon: XLogo,
        path: 'https://twitter.com/intent/tweet?text=', // Twitter (X) uses the text parameter
    },
    {
        icon: LinkedinLogo,
        path: 'https://www.linkedin.com/shareArticle?mini=true&url=', // LinkedIn
    },
    {
        icon: whatsappLogo,
        path: 'https://wa.me/?text=', // WhatsApp uses the text parameter
    },
];
