import kmFilter from './kmFilter';

import dmbdOSSImageUrlResizeFilter from './dmbdOSSImageUrlResizeFilter';
import dmbdResourceSizeFilter from './dmbdResourceSizeFilter';
import dmbdVideoTimeFormatFilter from './dmbdVideoTimeFormatFilter';
import dmbdAudioTimeFormatFilter from './dmbdAudioTimeFormatFilter';


const filters = [
    kmFilter,
    dmbdOSSImageUrlResizeFilter,
    dmbdResourceSizeFilter,
    dmbdVideoTimeFormatFilter,
    dmbdAudioTimeFormatFilter
];

export default app => {
    filters.forEach(filter => {
        filter(app);
    })
};