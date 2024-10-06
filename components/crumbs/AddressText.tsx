import { useState, useEffect } from 'react';
import { getLocationInfo } from '@/lib/utils';

interface LocationInfo {
  address: {
    country: string;
    city: string;
    suburb: string;
  };
  timezone: string;
}

export default function AddressText({ lat, lng }: { lat: number, lng: number }) {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  useEffect(() => {
    const fetchLocationInfo = async () => {
      const info = await getLocationInfo(lat, lng);
      setLocationInfo(info);
    };
    fetchLocationInfo();
  }, [lat, lng]);

  return (
    <p>
      {`${locationInfo?.address?.suburb || ''} ${locationInfo?.address?.city || ''} ${locationInfo?.address?.country || 'Loading...'}`}
    </p>
  );
}
