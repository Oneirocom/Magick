import { UploadIcon } from '@radix-ui/react-icons'
import { cn } from '@magickml/client-ui'

type KnowledgeUploadInputProps = {
  inputProps: React.ComponentProps<'input'>
}

const allowedTypes = [
  '.eml, .txt, .html, .json, .md, .msg, .rst, .rtf, .txt, .xml, .jpeg, .jpg, .png, .csv, .doc, .docx, .epub, .odt, .pdf, .ppt, .pptx, .tsv, .xlsx',
]
export const KnowledgeUploadInput: React.FC<KnowledgeUploadInputProps> = ({
  inputProps,
}) => {
  const { disabled, ...rest } = inputProps

  return (
    <div>
      <label
        className={cn(
          'flex flex-col items-center justify-center w-full h-64 border-2 border-ds-neutral color-transition border-dashed rounded-[5px] cursor-pointer bg-ds-card-alt relative',
          { 'hover:border-ds-primary ': !disabled, 'opacity-50': disabled }
        )}
        htmlFor="dropzone-file"
      >
        {disabled && (
          <div className="absolute inset-0 h-full w-full flex items-center justify-center z-50 bg-ds-card-alt">
            Uploading <span className="ml-1 loading loading-xs loading-dots" />
          </div>
        )}

        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-10 h-10 mb-3" />
          <p className="mb-2 text-sm">
            <span className="font-semibold">Click to upload</span> or{' '}
            <span className="font-semibold">drag and drop</span>
          </p>
          <p className="text-xs mx-8 text-center">{allowedTypes.join(', ')}</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={allowedTypes.join(', ')}
          {...rest}
        />
      </label>
    </div>
  )
}
