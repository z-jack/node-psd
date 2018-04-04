function PSD() {
    if (process.env.NODE_ENV !== 'production' && !(this instanceof PSD)) {
        console.warn('PSD should be called by `new` keyword.')
        return
    }
    
}

module.exports = PSD