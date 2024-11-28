import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const Pagination = ({ currentPage, pageCount, onPageChange, totalDocs, limit }) => {
    const numPagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(numPagesToShow / 2));
    let endPage = Math.min(pageCount, startPage + numPagesToShow - 1);
  
    if (currentPage < Math.ceil(numPagesToShow / 2)) {
      startPage = 1;
      endPage = Math.min(pageCount, numPagesToShow);
    } else if (currentPage > pageCount - Math.floor(numPagesToShow / 2)) {
      endPage = pageCount;
      startPage = Math.max(1, pageCount - numPagesToShow + 1);
    }
  
    
    
    const resultsOnPage = Math.min(totalDocs - (currentPage - 1) * limit, limit);
  
    return (
      <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          Anterior
        </button>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{resultsOnPage}</span> de <span className="font-medium">{totalDocs}</span> resultados
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                <button
                  key={startPage + i}
                  onClick={() => onPageChange(startPage + i)}
                  className={`mx-1 px-4 py-2 rounded text-sm font-medium ${currentPage === startPage + i ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {startPage + i}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          Siguiente
          <ChevronRightIcon className="h-5 w-5 ml-2" aria-hidden="true" />
        </button>
      </div>
    );
  };

export default Pagination;