import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { investmentService } from '../services/investmentService';

const ZerodhaCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const requestToken = queryParams.get('request_token');
        const action = queryParams.get('action');

        if (!requestToken) {
            setStatus('error');
            setErrorMessage('No request token found in the URL. Login might have failed or been cancelled.');
            
            // Redirect back to investments after 3 seconds
            setTimeout(() => navigate('/investments'), 3000);
            return;
        }

        const connectToBroker = async () => {
            try {
                await investmentService.connectZerodha(requestToken);
                setStatus('success');
                // Redirect back to investments after a short delay
                setTimeout(() => navigate('/investments'), 2000);
            } catch (err) {
                console.error("Zerodha link failed", err);
                setStatus('error');
                setErrorMessage('Failed to securely link the account. It might have expired or the backend configuration is invalid.');
                setTimeout(() => navigate('/investments'), 3000);
            }
        };

        connectToBroker();

    }, [location, navigate]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />

                <div className="mb-6 flex justify-center">
                    {status === 'processing' && (
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
                            <div className="w-20 h-20 border-4 border-accent rounded-full absolute top-0 left-0 border-t-transparent animate-spin"></div>
                            <ShieldCheck className="w-8 h-8 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-10 h-10 text-emerald-600" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-2">
                    {status === 'processing' && 'Securing Connection...'}
                    {status === 'success' && 'Account Linked!'}
                    {status === 'error' && 'Connection Failed'}
                </h1>
                
                <p className="text-slate-500 font-medium">
                    {status === 'processing' && 'Please wait while we exchange encryption tokens with Kite Connect. Do not close this window.'}
                    {status === 'success' && 'Your Zerodha account has been successfully linked. Redirecting back to your portfolio...'}
                    {status === 'error' && errorMessage}
                </p>
            </div>
        </div>
    );
};

export default ZerodhaCallback;
