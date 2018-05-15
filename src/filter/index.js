import kmFilter from './kmFilter'

const filters = [kmFilter]
    
export default app => {
    filters.forEach(filter => {
        filter(app);
    })
}