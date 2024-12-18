import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useState } from 'react'

export default function Captcha({ onCaptchaVerified }) {

    const [captchaToken, setCaptchaToken] = useState(null);

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
        if (token) {
            onCaptchaVerified(token);
        } 
    };
    
    return (
        <div style={{ padding: '1rem' }}>
            <HCaptcha
                sitekey={import.meta.env.VITE_TOKEN_CAPTCHA}
                onVerify={handleCaptchaChange}
            />
        </div>
    )
}