import ColorSwatch from '../ColorSwatch'

export default function ProductImage({ variant, productName, isTwoToneReady }) {
  return (
    <>
      {variant.image ? (
        <div id="product-image" className="relative aspect-square w-full scroll-mt-20 overflow-hidden bg-burgundy-tint">
          <img
            src={variant.image}
            alt={`${productName} in ${variant.name}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-black/50 px-3 py-1.5">
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              {variant.name}
            </p>
          </div>
        </div>
      ) : (
        <div id="product-image" className="flex aspect-square w-full scroll-mt-20 items-center justify-center bg-burgundy-tint">
          <div className="text-center">
            <ColorSwatch
              hex={variant.hex}
              topHex={variant.topHex}
              bottomHex={variant.bottomHex}
              isTwoTone={variant.isTwoTone}
              className="mx-auto h-20 w-20"
            />
            <p className="mt-4 text-sm text-ink/50">
              {isTwoToneReady
                ? 'Custom two-tone colour — no preview photo'
                : variant.isCustom
                  ? 'Custom colour — made to order, no preview photo'
                  : 'Photo coming soon'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
