import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowSmRightIcon } from '@heroicons/react/solid';

/* eslint-disable-next-line */
export interface JobItemDetailsProps {
  job: {
    id: string;
    name: string;
    priority: number;
    data: Object;
    state: string;
    retrylimit: number;
    retrycount: number;
    retrydelay: number;
    retrybackoff: boolean;
    startafter: number;
    startedon: number;
    singletonkey: string;
    singletonon: unknown;
    expirein: number;
    createdon: number;
    completedon: number;
    keepuntil: number;
    on_complete: boolean;
    output: unknown;
  };
}

var isDate = function (timestamp: number): boolean {
  var minDate = new Date('1970-01-01 00:00:01');
  var maxDate = new Date('2038-01-19 03:14:07');
  var date = new Date(timestamp);
  return date > minDate && date < maxDate;
};

function renderNumber(value: unknown) {
  if (typeof value === 'number' && isDate(value)) {
    return new Date(value).toISOString();
  }
  return String(value);
}

function renderJsonValue(
  value: string | null | Object | number | Array<unknown>
) {
  let colorType: string = typeof value;
  if (value === null) {
    colorType = 'null';
  }
  if (Array.isArray(value)) {
    colorType = 'array';
  }
  switch (colorType) {
    case 'string':
      return <span className="text-teal-700 pr-4 w-32">{String(value)}</span>;
    case 'number':
      return (
        <span className="text-indigo-700 pr-4 w-32">{renderNumber(value)}</span>
      );
    case 'boolean':
      return <span className="text-rose-600 pr-4 w-32">{String(value)}</span>;
    case 'null':
      return <span className="text-cyan-500 pr-4 w-32">{String(value)}</span>;
    case 'object':
      return (
        <span className="text-gray-600 pr-4 w-32 whitespace-pre-wrap ">
          {JSON.stringify(value, null, 2)}
        </span>
      );
    default:
      return <span className="text-gray-600 pr-4">{String(value)}</span>;
  }
}

function renderJsonRows(job: Object) {
  return Object.keys(job).map((key, idx) => {
    return (
      <p className="py-1 px-4 flex flex-row">
        <span className="text-red-700 pr-4 w-32">{key}</span>
        <span className="text-gray-300 pr-4">
          <ArrowSmRightIcon className="h-4 w-4" />
        </span>
        <span className="text-gray-600 pr-4">{renderJsonValue(job[key])}</span>
      </p>
    );
  });
}

export default function JobItemDetails(props: JobItemDetailsProps) {
  const { job } = props;
  return (
    <>
      <div className="flex border-none max-w-ful" key={job.id}>
        <pre>
          <code className="font-mono text-sm py-4 px-4">
            {renderJsonRows(job)}
          </code>
        </pre>
      </div>
    </>
  );
}
