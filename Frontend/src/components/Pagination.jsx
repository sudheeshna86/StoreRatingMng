const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 border border-slate-200">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={prevDisabled}
        className="rounded-full bg-white px-4 py-2 text-slate-700 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={nextDisabled}
        className="rounded-full bg-white px-4 py-2 text-slate-700 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
