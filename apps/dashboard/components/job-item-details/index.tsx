import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';

/* eslint-disable-next-line */
export interface JobItemDetailsProps {
  job: {
    id: string;
    name: string;
    state: string;
    createdon: string;
    completedon: string;
  };
}

export default function JobItemDetails(props: JobItemDetailsProps) {
  const { job } = props;
  return (
    <>
      <div className="flex border-none px-5 bg-gray-50 max-w-full">
        <pre>
          <code className="font-mono text-sm">
            {JSON.stringify(job, null, 2)}
          </code>
        </pre>
      </div>
    </>
  );
}
