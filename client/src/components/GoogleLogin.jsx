import { Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

function GoogleLogin({ authResponse }) {
    const { t } = useTranslation('translation', { keyPrefix: 'Login' });

	const googleLogin = useGoogleLogin({
		onSuccess: authResponse,
		onError: authResponse,
		flow: "auth-code",
	});

	return (
		<button onClick={googleLogin} className="googleSignIn googleSignIn--white">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/G-on-clear.svg" alt="Google logo" />
			<Typography className="googleSignIn__text">{t('google')}</Typography>
		</button>
	);
}

export default GoogleLogin