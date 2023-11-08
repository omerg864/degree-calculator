import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

function Verify() {

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    const { t } = useTranslation('translation', { keyPrefix: 'Verify' });

    const verify = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/user/verify/${params.id}`, { headers: {
                "Content-type": "application/json"
            } ,method: 'GET'})
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                toast.success(t('verify'));
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
    }

    useEffect(() => {
        verify();
    }, [])

    if(isLoading){
        return <Spinner/>;
    }

  return (
    <div style={{display: 'flex', width: "100%", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
        <Typography variant='h5'>{t('login')}</Typography>
    </div>
  )
}

export default Verify