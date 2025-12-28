// ... (Keep your imports and CATEGORIES data at the top as they were)

// Wrap the sub-component in forwardRef to fix the warning
const CategoryPortal = React.forwardRef<HTMLDivElement, any>(
  ({ category, onNavigate, isHovered, onHover, onLeave }, ref) => {
    const gridSpan = 
      category.size === 'large' ? 'md:col-span-4' : 
      category.size === 'medium' ? 'md:col-span-3' : 'md:col-span-2';

    return (
      <motion.div
        ref={ref} // Attach the forwarded ref here
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className={`${gridSpan} relative aspect-[4/5] bg-white group cursor-pointer overflow-hidden border border-black/[0.03] transition-all duration-700 hover:shadow-2xl hover:border-black/[0.08]`}
        onClick={() => onNavigate(category.page)}
      >
        {/* Background Depth layer */}
        <div className="absolute inset-0 bg-[#FBFBFB]" />
        <motion.div 
          animate={{ scale: isHovered ? 1.05 : 1, opacity: isHovered ? 0.2 : 0.05 }}
          className="absolute inset-0 grayscale transition-all duration-1000 blur-sm"
        >
          <img src={category.image} className="w-full h-full object-cover" alt="" />
        </motion.div>

        {/* Center Floating Object */}
        <div className="absolute inset-0 p-16 flex items-center justify-center">
          <motion.img
            animate={{ 
              y: isHovered ? -15 : 0,
              rotate: isHovered ? 3 : 0,
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? 'drop-shadow(0 40px 50px rgba(0,0,0,0.15))' : 'drop-shadow(0 10px 10px rgba(0,0,0,0.03))'
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            src={category.image}
            className="w-full h-full object-contain z-20"
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end bg-gradient-to-t from-white via-white/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700">
          <span className="text-[9px] uppercase tracking-[0.4em] font-black text-Color-Light-300 mb-2">Explore Collection</span>
          <h4 className="text-xl font-serif text-Color-Dark-500 mb-4">{category.title}</h4>
          <div className="flex justify-between items-center border-t border-black/5 pt-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-Color-Gray-400">{category.priceRange}</span>
            <div className="flex items-center gap-2 text-Color-Champagne-Gold font-bold text-[10px] uppercase tracking-widest">
              Enter <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Static Info (Visible when not hovered) */}
        <div className="absolute top-8 left-8 z-30 group-hover:opacity-0 transition-opacity duration-500">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-Color-Dark-500">{category.title}</h4>
          <p className="text-[9px] text-Color-Light-300 mt-1 uppercase font-bold tracking-widest">{category.productCount} Pieces</p>
        </div>
      </motion.div>
    );
  }
);

// Set display name for debugging tools
CategoryPortal.displayName = 'CategoryPortal';