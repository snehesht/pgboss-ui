import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  DotsCircleHorizontalIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CollectionIcon,
} from '@heroicons/react/solid';
import Layout from '../../components/layout';
import JobItemDetails from '../../components/job-item-details';
import {
  ClockIcon,
  DocumentIcon,
  FilterIcon,
  RefreshIcon,
  SearchIcon,
  SwitchVerticalIcon,
  TicketIcon,
  XIcon,
} from '@heroicons/react/outline';

type Job = {
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

/* eslint-disable-next-line */
export interface JobsProps {}

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

function renderResponseTime(timeInMs: number) {
  if (timeInMs < 100) {
    return (
      <strong className="text-green-600 bg-green-100 px-2 rounded-md">
        {timeInMs} ms
      </strong>
    );
  } else if (timeInMs > 100 && timeInMs < 500) {
    return (
      <strong className="text-yellow-600 bg-yellow-100 px-2 rounded-md">
        {timeInMs} ms
      </strong>
    );
  }
  return (
    <strong className="text-red-600 bg-red-100 px-2 rounded-md">
      {timeInMs} ms
    </strong>
  );
}

function getDate(job: Job) {
  switch (job.state) {
    case 'created':
      return new Date(job.createdon).toISOString();
    case 'retry':
      return new Date(job.createdon).toISOString();
    case 'active':
      return new Date(job.startedon).toISOString();
    case 'completed':
      return new Date(job.completedon).toISOString();
    case 'expired':
      return new Date(job.startedon).toISOString();
    case 'cancelled':
      return new Date(job.startedon).toISOString();
    case 'failed':
      return new Date(job.startedon).toISOString();
    case 'expired':
      return new Date(job.createdon).toISOString();
    default:
      return new Date(job.createdon).toISOString();
  }
}

function renderState(state: string) {
  switch (state) {
    case 'created':
      return (
        <>
          <CheckCircleIcon className="h-5 text-gray-400" />
          <span className="px-1 inline-flex text-xs leading-5 font-semibold rounded text-gray-600">
            {state.toUpperCase()}
          </span>
        </>
      );
    case 'retry':
      return (
        <>
          <ExclamationCircleIcon className="h-5 text-red-400" />
          <span className="px-1 inline-flex text-xs leading-5 font-semibold rounded text-red-600">
            {state.toUpperCase()}
          </span>
        </>
      );
    case 'active':
      return (
        <>
          <DotsCircleHorizontalIcon className="h-5 text-yellow-400" />
          <span className="px-1 inline-flex text-xs leading-5 font-semibold rounded text-yellow-600">
            {state.toUpperCase()}
          </span>
        </>
      );
    case 'completed':
      return (
        <>
          <CheckCircleIcon className="h-5 text-green-400" />
          <span className="px-1 inline-flex text-xs leading-5 font-semibold rounded text-green-600">
            {state.toUpperCase()}
          </span>
        </>
      );
    case 'expired':
      return (
        <>
          <InformationCircleIcon className="h-5 text-orange-400" />
          <span className="px-1 inline-flex text-xs leading-5 font-semibold rounded text-orange-600">
            {state.toUpperCase()}
          </span>
        </>
      );
    case 'cancelled':
      return (
        <>
          <XCircleIcon className="h-5 text-red-400" />
          <span className="px-1 inline-flex text-xs leading-5 font-semibold rounded text-red-600">
            {state.toUpperCase()}
          </span>
        </>
      );
    case 'failed':
      return (
        <>
          <MinusCircleIcon className="h-5 text-red-400" />
          <span className="px-1 inline-flex text-xs leading-5 font-semibold rounded text-red-600">
            {state.toUpperCase()}
          </span>
        </>
      );
    default:
      return (
        <>
          <CheckCircleIcon className="h-5 text-gray-400" />
          <span className="px-1 inline-flex text-xs leading-5 font-semibold rounded text-gray-600">
            {state.toUpperCase()}
          </span>
        </>
      );
  }
}

function JobItem(props: { job: Job }) {
  const [open, setOpen] = useState(false);
  const { job } = props;
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <li key={job.id} className="border-1" onClick={handleClick}>
        <a href="#" className="block hover:bg-gray-50">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600 truncate">
                {job.name}
              </p>
              <div className="ml-2 flex-shrink-0 flex">
                {job.singletonkey !== null ? (
                  <span className="ml-2 mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                    SINGLETON
                  </span>
                ) : null}
                {job.startafter && job.startafter !== job.createdon ? (
                  <span className="ml-1 mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                    DELAYED
                  </span>
                ) : null}
                {renderState(job.state)}
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p
                  key={`${job.id}_date`}
                  className="flex items-center text-xs text-gray-500 pr-4"
                >
                  <ClockIcon
                    className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  {new Date(job.createdon).toISOString()}
                </p>
                <p
                  key={`${job.id}_name`}
                  className="flex items-center text-xs text-gray-500"
                >
                  <TicketIcon
                    className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  {job.id}
                </p>
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
                <RefreshIcon
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                <p>
                  <time>{getDate(job)}</time>
                </p>
              </div>
            </div>
          </div>
        </a>
      </li>
      {open ? <JobItemDetails job={job} /> : null}
    </>
  );
}

export function Jobs(props: JobsProps) {
  // const pageSize = 10;
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [queryCount, setQueryCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [jobs, setJobs] = useState([]);
  const [fields, setFields] = useState([]);
  const [offset, setOffset] = useState(0);
  const [filterState, setFilterState] = useState('all');
  const [isLoading, setLoading] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [queryTime, setQueryTime] = useState(0);

  const currentResultStart = offset + 1;
  const currentResultEnd = offset + pageSize;

  // Refresh jobs every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Refresh jobs', queryCount + 1);
      setQueryCount(queryCount + 1);
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [queryCount]);

  useEffect(() => {
    setLoading(true);
    const fetchJobs = async () => {
      const startTime = Date.now();
      const request = await fetch('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          offset,
          limit: pageSize,
          state: filterState,
          search: debouncedSearchTerm,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const endTime = Date.now();
      const { data, fields } = await request.json();
      setFields(fields);
      setJobs(data);
      setLoading(false);
      setQueryTime(endTime - startTime);
    };

    fetchJobs().catch((error) => console.error(error));
  }, [queryCount, offset, pageSize, filterState, debouncedSearchTerm]);

  const handlePrevious = () => {
    if (offset - pageSize < 0) {
      return setOffset(0);
    }
    setOffset(offset - pageSize);
  };
  const handleNext = () => {
    setOffset(offset + pageSize);
  };

  const handleFilterButton = () => {
    setShowFilterDialog(true);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleFilterStateChange = (e) => {
    setFilterState(e.target.value);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Layout>
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
              <p className="text-sm py-2 text-gray-500">
                List of all the pgboss jobs in the database{' '}
                <code className="text-xs px-2 py-2 bg-red-50 text-red-500 rounded-md">
                  pgboss.job
                </code>
              </p>
            </div>
            <div className="flex max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 text-end align-middle justify-end">
              <label className="relative inline-block ml-2 mr-2 max-w-sm md:w-96">
                <span className="sr-only">Search</span>
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400 focus:text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  className="placeholder:italic bg-gray-100 placeholder:text-slate-400 block w-full rounded-sm py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-gray-400 focus:ring-gray-400 focus:ring-1 sm:text-sm"
                  placeholder="Search by job name"
                  type="text"
                  name="search"
                  onChange={handleSearchTermChange}
                />
              </label>
              <label className="relative inline-block ml-2 mr-2">
                <span className="sr-only">State</span>
                <span className="absolute inset-y-0 right-1 flex items-center pointer-events-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </span>
                <select
                  id="state"
                  name="state"
                  className="placeholder:italic bg-gray-100 placeholder:text-slate-400 block w-full rounded-sm py-2 pr-8 pl-4 shadow-sm focus:outline-none sm:text-sm appearance-none text-gray-600 hover:text-gray-800 uppercase"
                  defaultValue="all"
                  onChange={handleFilterStateChange}
                >
                  <option className="uppercase">all</option>
                  <option className="uppercase">created</option>
                  <option className="uppercase">retry</option>
                  <option className="uppercase">active</option>
                  <option className="uppercase">completed</option>
                  <option className="uppercase">expired</option>
                  <option className="uppercase">cancelled</option>
                  <option className="uppercase">failed</option>
                </select>
              </label>
              <div className="border-x border-gray-200 mx-2 h-6 self-center" />
              <label className="relative inline-block ml-2 mr-2">
                <span className="sr-only">State</span>
                <span className="absolute inset-y-0 right-1 flex items-center pointer-events-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </span>
                <select
                  id="location"
                  name="location"
                  className="placeholder:italic bg-gray-100 placeholder:text-slate-400 block w-full rounded-sm py-2 pr-8 pl-4 shadow-sm focus:outline-none sm:text-sm appearance-none text-gray-600 hover:text-gray-800"
                  defaultValue="10"
                  onChange={handlePageSizeChange}
                >
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </label>
              <button
                className="text-sm self-center inline-flex text-gray-600 bg-gray-100 rounded-sm px-2 py-2 mr-1 hover:bg-indigo-700 hover:text-white "
                onClick={handlePrevious}
              >
                <ChevronLeftIcon className="h-5 w-5 " aria-hidden="true" />
              </button>
              <button
                className="text-sm self-center inline-flex text-gray-600 bg-gray-100 rounded-sm px-2 py-2 ml-1 hover:bg-indigo-700 hover:text-white "
                onClick={handleNext}
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white shadow-lg overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y-8 divide-gray-50">
                  {jobs.length > 0 ? (
                    jobs.map((job) => <JobItem job={job} key={job.id} />)
                  ) : (
                    <span className="inline-block px-4 py-6 mt-1 w-full text-center text-gray-500">
                      No Jobs found, please check <strong>Archive</strong> for
                      archived jobs
                    </span>
                  )}
                </ul>
              </div>
              <p className="text-sm inline-flex flex-row text-gray-500 px-2 mt-4">
                <CollectionIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                <span className="mr-1"> Showing jobs </span>
                <strong>{currentResultStart}</strong>
                <span className="mr-1 ml-1"> to </span>
                <strong>{currentResultEnd}</strong>
              </p>
              <p className="text-sm inline-flex flex-row text-gray-500 px-2 mt-4 float-right">
                <SwitchVerticalIcon
                  className="h-5 w-5 mr-1"
                  aria-hidden="true"
                />
                <span className="mr-1"> Query took </span>
                {renderResponseTime(queryTime)}
              </p>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}

export default Jobs;
