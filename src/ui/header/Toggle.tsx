export default function Toggle() {
	return (
		<label className="relative grid size-11 cursor-pointer place-items-center lg:hidden">
			<input id="header-toggle" type="checkbox" hidden />

			<span className="sr-only header-open:hidden">Open menu</span>
			<span className="sr-only header-closed:hidden">Close menu</span>
			<span className="absolute h-px w-5 -translate-y-1 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] header-open:translate-y-0 header-open:rotate-45" />
			<span className="absolute h-px w-5 translate-y-1 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] header-open:translate-y-0 header-open:-rotate-45" />
		</label>
	)
}
