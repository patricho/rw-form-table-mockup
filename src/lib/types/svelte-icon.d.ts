declare module '@jamescoyle/svelte-icon' {
	import type { SvelteComponent } from 'svelte';
	
	interface SvgIconProps {
		type: string;
		path: string;
		size?: string | number;
		[key: string]: any;
	}
	
	export default class SvgIcon extends SvelteComponent<SvgIconProps> {}
}