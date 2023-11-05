import React from 'react'
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';


const PasswordRules = () => {

        const { t } = useTranslation('translation', { keyPrefix: 'PasswordRules' })
    return (
        <div style={{ textAlign: "start"}}>
        <Typography variant="body2" color="text.secondary">
            {t("start")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            • {t("english")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            • {t("smallLetter")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            • {t("capitalLetter")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            • {t("number")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            • {t("length")}
            </Typography>
        </div>
    )
}

export default PasswordRules;