import React, { useState, useEffect } from 'react';

const GetIP: React.FC = () => {
    const [ip, setIp] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchIP = async () => {
            try {
                const response = await fetch('https://geolocation-db.com/json/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setIp(data.IPv4);
                alert(data.IPv4);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err:any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIP();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <p>Your IP Address is: {ip}</p>
        </div>
    );
};

export default GetIP;