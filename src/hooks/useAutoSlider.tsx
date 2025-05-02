/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useInView } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";

type UseAutoSliderOptions = {
	intervalDuration?: number;
	startDelay?: number;
	overrideActiveSlide?: number | null;
	startTrigger?: boolean;
};

const useAutoSlider = (ref: RefObject<HTMLElement>, itemCount: number, options?: UseAutoSliderOptions) => {
	const { intervalDuration = 3000, startDelay = 0, overrideActiveSlide = null, startTrigger = true }: UseAutoSliderOptions = options;
	const [activeSlide, setActiveSlide] = useState(0);
	const isInView = useInView(ref, { once: false });
	const intervalRef = useRef<number | null>(null);

	const updateSlide = () => {
		setActiveSlide((prevSlide) => (prevSlide + 1) % itemCount);
	};

	useEffect(() => {
		if (isInView && startTrigger && itemCount > 1) {
			if (intervalRef.current) clearInterval(intervalRef.current);

			const timeout = setTimeout(() => {
				intervalRef.current = window.setInterval(updateSlide, intervalDuration);
			}, startDelay);

			return () => {
				clearTimeout(timeout);
				if (intervalRef.current) clearInterval(intervalRef.current);
			};
		}
		if (intervalRef.current) clearInterval(intervalRef.current);
	}, [isInView, startTrigger, itemCount, intervalDuration, startDelay, activeSlide]);

	useEffect(() => {
		if (overrideActiveSlide !== null && overrideActiveSlide !== activeSlide) {
			setActiveSlide(overrideActiveSlide);

			if (intervalRef.current) clearInterval(intervalRef.current);
			intervalRef.current = window.setInterval(updateSlide, intervalDuration);
		}
	}, [overrideActiveSlide, intervalDuration]);

	return activeSlide;
};

export default useAutoSlider;
