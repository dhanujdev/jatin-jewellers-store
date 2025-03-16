"use client"

import * as React from "react"
import { type EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

type CarouselApi = ReturnType<typeof useEmblaCarousel>[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = CarouselProps & {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

type CarouselComponentProps = CarouselProps & {
  className?: string
  children: any
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselComponentProps>(
  (props, ref) => {
    const {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...rest
    } = props

    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: any) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("select", onSelect)
      api.on("reInit", onSelect)

      return () => {
        api.off("select", onSelect)
        api.off("reInit", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...rest}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

type CarouselContentProps = {
  className?: string
  children?: any
} & React.HTMLAttributes<HTMLDivElement>

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  (props, ref) => {
    const { className, ...rest } = props
    const { carouselRef, orientation } = useCarousel()

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
            className
          )}
          {...rest}
        />
      </div>
    )
  }
)
CarouselContent.displayName = "CarouselContent"

type CarouselItemProps = {
  className?: string
  children?: any
} & React.HTMLAttributes<HTMLDivElement>

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  (props, ref) => {
    const { className, ...rest } = props
    const { orientation } = useCarousel()

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className
        )}
        {...rest}
      />
    )
  }
)
CarouselItem.displayName = "CarouselItem"

type CarouselButtonProps = {
  className?: string
  children?: any
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  (props, ref) => {
    const { className, ...rest } = props
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
      <button
        ref={ref}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        {...rest}
      >
        <span className="sr-only">Previous slide</span>
      </button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  (props, ref) => {
    const { className, ...rest } = props
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
      <button
        ref={ref}
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        {...rest}
      >
        <span className="sr-only">Next slide</span>
      </button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
