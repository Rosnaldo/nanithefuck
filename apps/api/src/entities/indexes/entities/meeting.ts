import { meetingCollectionName } from '#const/collection_name_mapping';
import { IndexDescription } from 'mongodb';
import { UniqueIndex } from '../unique_index';

const indexes: Array<IndexDescription> = [
    {
        key: { name: 1 },
        unique: true,
        name: UniqueIndex.Meeting.name.key
    },
];

export default {
    indexes,
    collectionName: meetingCollectionName
}
