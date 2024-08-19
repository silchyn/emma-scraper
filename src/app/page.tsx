'use client';

import {
  useCallback,
  useState,
} from 'react';
import { Bid as BidData } from '@/typedefs';
import { Bid } from '@/components/Bid';
import { Form } from '@/components/Form';

export default function Home() {
  const [error, setError] = useState('');
  const [bid, setBid] = useState<BidData>();

  const handleSubmit = useCallback(async (bidId: string) => {
    const response = await fetch(`/api?bidId=${bidId}`);

    if (!response.ok) {
      setError(await response.text());

      return;
    }

    setBid(await response.json());
  }, []);

  return (
    <>
      <main className="bg-white rounded-3xl py-8 w-1/3 m-auto">
        <Form
          onSubmit={handleSubmit}
          error={error}
          setError={setError}
        />

        {bid && (
          <>
            <hr className="border-gray-100 mt-8" />
            <Bid bid={bid} />
          </>
        )}
      </main>

      <div className="invisible h-px mt-8" />
    </>
  );
}
