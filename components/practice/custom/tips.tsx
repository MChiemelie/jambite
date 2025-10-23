import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';

export function KeyboardShortcutsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type='button' className='inline-flex items-center justify-center gap-2 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-100' aria-label='View keyboard shortcuts'>
          <span>⌨️</span>
          <span>Keyboard Shortcuts</span>
        </button>
      </DialogTrigger>

      <DialogContent className='max-w-md bg-white text-black'>
        <DialogHeader>
          <DialogTitle className='text-center text-3xl font-bold'>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-center gap-3 rounded-lg bg-blue-50 p-3'>
            <div className='text-2xl'>💡</div>
            <p className='text-sm text-gray-700'>Quick keyboard guide for navigating the practice screen.</p>
          </div>

          <div className='flex flex-col gap-1'>
            <h3 className='text-sm font-semibold text-gray-900'>Answer Selection</h3>
            <div className='flex items-center gap-3 py-2'>
              <div className='flex gap-1'>
                <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>A</kbd>
                <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>B</kbd>
                <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>C</kbd>
                <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>D</kbd>
              </div>
              <span className='text-sm text-gray-600'>Select answer option</span>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <h3 className='text-sm font-semibold text-gray-900'>Navigation</h3>
            <div className='flex items-center gap-3 py-2'>
              <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>P</kbd>
              <span className='text-sm text-gray-600'>Previous question</span>
            </div>

            <div className='flex items-center gap-3 py-2'>
              <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>N</kbd>
              <span className='text-sm text-gray-600'>Next question</span>
            </div>

            <div className='flex items-center gap-3 py-2'>
              <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>R</kbd>
              <span className='text-sm text-gray-600'>Review answers</span>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <h3 className='text-sm font-semibold text-gray-900'>Submission</h3>
            <div className='flex items-center gap-3 py-2'>
              <div className='flex items-center gap-2'>
                <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>S</kbd>
                <span className='text-xs text-gray-400'>or</span>
                <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>E</kbd>
              </div>
              <span className='text-sm text-gray-600'>Open submit dialog</span>
            </div>

            <div className='flex items-center gap-3 py-2'>
              <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>Y</kbd>
              <span className='text-sm text-gray-600'>Confirm submission</span>
            </div>

            <div className='flex items-center gap-3 py-2'>
              <kbd className='min-w-[28px] rounded border border-gray-300 bg-white px-2 py-1 text-center font-mono text-xs font-semibold shadow-sm'>N</kbd>
              <span className='text-sm text-gray-600'>Cancel submission</span>
            </div>
          </div>

          <div className='border-t border-gray-200 pt-4'>
            <p className='text-center text-xs text-gray-500'>
              Press <kbd className='rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-xs'>Esc</kbd> to close dialogs
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
