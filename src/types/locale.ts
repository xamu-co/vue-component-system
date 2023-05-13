/**
 * global locale
 *
 * @locale
 */
interface iLocale {
	/** @example "Yes" */
	yes?: string;
	/** @example "No" */
	no?: string;
	/** @example "Increase" */
	increase?: string;
	/** @example "Decrease" */
	decrease?: string;
	dialog?: {
		/** @example "Cancel" */
		cancel?: string;
		/** @example "Continue" */
		continue?: string;
	};
}

/**
 * input locale
 *
 * @locale
 */
interface iLocaleInput {
	/** @example "--SELECT--" */
	select_placeholder?: string;
	/** @example "{count} of {amount}" */
	input_one_of_amount?: string;
	/** @example "Delete file | Delete files" */
	input_delete_files?: string;
	/** @example "Thumbnail" */
	input_thumb?: string;
	/** @example "Choose a file | Choose files" */
	input_choose_file?: string;
	/** @example "Or drop it here | Or drop them here" */
	input_or_drop_files_here?: string;
	/** @example "maximum {size}MB per file" */
	input_max_file_size_mb?: string;
	/** @example "Drop file here | Drop files here" */
	input_drop_files_here?: string;
	/** @example "Completed" */
	input_completed?: string;
	/** @example "Loading file... | Loading files..." */
	input_loading_files?: string;
	/** @example "Restablish field" */
	input_restablish_field?: string;
	dialog?: {
		/** @example "File limit" */
		input_file_limit?: string;
		/** @example "This field only allows {amount} file | This field only allows {amount} files" */
		input_file_limit_text?: string;
		/** @example "Wrong format" */
		input_wrong_format_image?: string;
		/** @example "This field only allows image files" */
		input_wrong_format_image_text?: string;
		/** @example "File too big" */
		input_too_big?: string;
		/** @example "the file exceeds the allowed size" */
		input_too_big_text?: string;
		/** @example "Something went wrong" */
		input_unknown_error?: string;
		/** @example "There was an error uploding the files, try again later" */
		input_unknown_error_text?: string;
	};
}

/**
 * plugin locale
 *
 * @locale
 */
export type tPluginLocale = iLocale & iLocaleInput;
