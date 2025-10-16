import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';

export function KeyboardShortcutsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type='button' className='inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-blue-50 border border-blue-200 text-sm font-medium hover:bg-blue-100 transition-colors' aria-label='View keyboard shortcuts'>
          <span>⌨️</span>
          <span>Keyboard Shortcuts</span>
        </button>
      </DialogTrigger>

      <DialogContent className='max-w-md text-black bg-white'>
        <DialogHeader>
          <DialogTitle className='text-3xl text-center font-bold'>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3 justify-center p-3 bg-blue-50 rounded-lg'>
            <div className='text-2xl'>💡</div>
            <p className='text-sm text-gray-700'>Quick keyboard guide for navigating the practice screen.</p>
          </div>

          <div className='flex flex-col gap-1'>
            <h3 className='text-sm font-semibold text-gray-900'>Answer Selection</h3>
            <div className='flex items-center gap-3 py-2'>
              <div className='flex gap-1'>
                <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>A</kbd>
                <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>B</kbd>
                <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>C</kbd>
                <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>D</kbd>
              </div>
              <span className='text-sm text-gray-600'>Select answer option</span>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <h3 className='text-sm font-semibold text-gray-900'>Navigation</h3>
            <div className='flex items-center gap-3 py-2'>
              <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>P</kbd>
              <span className='text-sm text-gray-600'>Previous question</span>
            </div>

            <div className='flex items-center gap-3 py-2'>
              <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>N</kbd>
              <span className='text-sm text-gray-600'>Next question</span>
            </div>

            <div className='flex items-center gap-3 py-2'>
              <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>R</kbd>
              <span className='text-sm text-gray-600'>Review answers</span>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <h3 className='text-sm font-semibold text-gray-900'>Submission</h3>
            <div className='flex items-center gap-3 py-2'>
              <div className='flex gap-2 items-center'>
                <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>S</kbd>
                <span className='text-gray-400 text-xs'>or</span>
                <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>E</kbd>
              </div>
              <span className='text-sm text-gray-600'>Open submit dialog</span>
            </div>

            <div className='flex items-center gap-3 py-2'>
              <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>Y</kbd>
              <span className='text-sm text-gray-600'>Confirm submission</span>
            </div>

            <div className='flex items-center gap-3 py-2'>
              <kbd className='px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-semibold min-w-[28px] text-center'>N</kbd>
              <span className='text-sm text-gray-600'>Cancel submission</span>
            </div>
          </div>

          <div className='pt-4 border-t border-gray-200'>
            <p className='text-xs text-gray-500 text-center'>
              Press <kbd className='px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono'>Esc</kbd> to close dialogs
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
