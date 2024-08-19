import {
  ChangeEventHandler, FC,
  FormEventHandler,
  useCallback,
  useState,
} from 'react';

interface Props {
  onSubmit: (bidId: string) => Promise<void>;
  error: string;
  setError: (error: string) => void;
}

export const Form: FC<Props> = ({ onSubmit, error, setError }) => {
  const [bidId, setBidId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange: ChangeEventHandler<
    HTMLInputElement
  > = useCallback(({ target }) => {
    setBidId(target.value);
    setError('');
  }, [setError]);

  const handleSubmit: FormEventHandler<
    HTMLFormElement
  > = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit(bidId);
    setLoading(false);
  }, [bidId, onSubmit]);

  return (
    <form
      className="flex flex-col gap-4 px-8"
      onSubmit={handleSubmit}
    >
      <section className="flex flex-col gap-2">
        <label htmlFor="bidId">Bid ID</label>

        <input
          id="bidId"
          type="text"
          placeholder="BPM000000"
          className="text-sm bg-neutral-100 outline-0 h-8 pl-4 rounded-md"
          value={bidId}
          onChange={handleChange}
        />

        <p className="text-xs text-rose-600">{error}</p>
      </section>

      <button
        type="submit"
        className="bg-black text-white rounded-md text-sm h-8 transition-transform active:scale-95 disabled:bg-neutral-300 disabled:active:scale-100"
        disabled={Boolean(loading || error)}
      >
        Parse
      </button>
    </form>
  );
};
