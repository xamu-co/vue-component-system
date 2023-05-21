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
	/** @example "Couldn't get the data" */
	could_not_get_data?: string;
	/** @example "Nothing to show" */
	nothing_to_show?: string;
	/** @example "Loading..." */
	loading?: string;
	/** @example "Close" */
	close?: string;
	/** @example "Ok" */
	ok?: string;
	swal?: {
		/** @example "Cancel" */
		cancel?: string;
		/** @example "Continue" */
		continue?: string;
	};
}

/**
 * modal locale
 *
 * @locale
 */
interface iLocaleModal {
	/** @example "Taking too long" */
	modal_taking_too_long?: string;
	swal?: {
		/** @example "Unauthorized" */
		modal_unauthorized?: string;
		/** @example "You are not allowed to perform this action" */
		modal_unauthorized_text?: string;
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
	/** @example "Restablish field" */
	select_restablish_field?: string;
	/** @example "{count} of {amount}" */
	file_one_of_amount?: string;
	/** @example "Delete file | Delete files" */
	file_delete_files?: string;
	/** @example "Thumbnail" */
	file_thumb?: string;
	/** @example "Choose a file | Choose files" */
	file_choose_file?: string;
	/** @example "Or drop it here | Or drop them here" */
	file_or_drop_files_here?: string;
	/** @example "maximum {size}MB per file" */
	file_max_file_size_mb?: string;
	/** @example "Drop file here | Drop files here" */
	file_drop_files_here?: string;
	/** @example "Completed" */
	file_completed?: string;
	/** @example "Loading file... | Loading files..." */
	file_loading_files?: string;
	swal?: {
		/** @example "File limit" */
		file_limit?: string;
		/** @example "This field only allows {amount} file | This field only allows {amount} files" */
		file_limit_text?: string;
		/** @example "Wrong format" */
		file_wrong_format_image?: string;
		/** @example "This field only allows image files" */
		file_wrong_format_image_text?: string;
		/** @example "File too big" */
		file_too_big?: string;
		/** @example "the file exceeds the allowed size" */
		file_too_big_text?: string;
		/** @example "Something went wrong" */
		file_unknown_error?: string;
		/** @example "There was an error uploding the files, try again later" */
		file_unknown_error_text?: string;
	};
}

/**
 * plugin locale
 *
 * @locale
 */
export type tPluginLocale = iLocale & iLocaleModal & iLocaleInput;
