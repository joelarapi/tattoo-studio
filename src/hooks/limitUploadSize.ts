import { APIError, type CollectionBeforeChangeHook } from 'payload'

type Limit = {
  /** Applies to files whose MIME type starts with this, e.g. "video/". Omit for all files. */
  mimePrefix?: string
  maxBytes: number
  message: string
}

/** Rejects uploads over a size limit, with a message editors can act on. */
export function limitUploadSize(limits: Limit[]): CollectionBeforeChangeHook {
  return ({ data, req }) => {
    const size: number | undefined = data.filesize ?? req.file?.size
    const mimeType: string | undefined = data.mimeType ?? req.file?.mimetype
    if (!size) return data
    for (const limit of limits) {
      const applies = !limit.mimePrefix || mimeType?.startsWith(limit.mimePrefix)
      if (applies && size > limit.maxBytes) throw new APIError(limit.message, 400, null, true)
    }
    return data
  }
}
