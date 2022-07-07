import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  DotsCircleHorizontalIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid';
import { useState } from 'react';
import JobItemDetails from '../job-item-details';

/* eslint-disable-next-line */
export interface JobItemProps {
  job: {
    id: string;
    name: string;
    state: string;
    createdon: string;
    completedon: string;
  };
}

function renderState(state: string) {
  switch (state) {
    case 'created':
      return <CheckCircleIcon className="h-5 px-2 text-gray-300" />;
    case 'retry':
      return <InformationCircleIcon className="h-5 px-2 text-red-300" />;
    case 'active':
      return <DotsCircleHorizontalIcon className="h-5 px-2 text-yellow-300" />;
    case 'completed':
      return <CheckCircleIcon className="h-5 px-2 text-green-300" />;
    case 'expired':
      return <ExclamationCircleIcon className="h-5 px-2 text-orange-300" />;
    case 'cancelled':
      return <MinusCircleIcon className="h-5 px-2 text-red-300" />;
    case 'failed':
      return <XCircleIcon className="h-5 px-2 text-red-300" />;
    default:
      return <CheckCircleIcon className="h-5 px-2 text-green-300" />;
  }
}

export function JobItem(props: JobItemProps) {
  const [open, setOpen] = useState(false);
  const { job } = props;

  function handleClick() {
    setOpen(!open);
  }

  return (
    <>
      <tr
        key={job.id}
        className="hover:bg-indigo-50 cursor-pointer"
        onClick={handleClick}
      >
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {job.id}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {job.name}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <span className="inline-flex">
            {renderState(job.state)}
            {job.state.toUpperCase()}
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {new Date(job.createdon).toISOString()}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {job.completedon ? new Date(job.completedon).toISOString() : ' ... '}
        </td>
      </tr>
      {open ? <JobItemDetails job={job} /> : null}
    </>
  );
}

export default JobItem;
