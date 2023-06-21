import DefaultSwal, { SweetAlertOptions } from "sweetalert2";

import { UtilsComposable } from "./utils";

/**
 * Swal composable
 *
 * @composable
 */
export function SwalComposable() {
	const { getLocale } = UtilsComposable();

	const Swal = DefaultSwal.mixin({
		timer: 1700,
		showConfirmButton: false,
		confirmButtonColor: "#0f47af",
		cancelButtonColor: "rgba(15, 71, 175, 0.1)",
		heightAuto: false,
		reverseButtons: true,
		buttonsStyling: false,
		cancelButtonText: getLocale("swal.cancel"),
		customClass: {
			confirmButton: "bttn",
			cancelButton: "bttnToggle",
			denyButton: "link",
		},
	});

	const preventAction: SweetAlertOptions = {
		icon: "warning",
		timer: undefined,
		showCancelButton: true,
		showConfirmButton: true,
		confirmButtonText: getLocale("swal.continue"),
		customClass: {
			confirmButton: ["bttn", "--tm-danger-light"],
			cancelButton: "bttnToggle",
			denyButton: "link",
		},
	};

	return {
		Swal,
		preventAction,
	};
}
