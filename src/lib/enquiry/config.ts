/** The Turnstile "action" name: set by the widget, checked by the server. */
export const TURNSTILE_ACTION = 'enquiry'

/** Reference files need the private R2 bucket: the browser uploads straight into it. */
export const referenceUploadsEnabled = () => Boolean(process.env.S3_PRIVATE_BUCKET)
