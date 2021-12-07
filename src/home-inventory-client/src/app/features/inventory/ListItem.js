import { Link } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import { base64ImageStringToImageSrc } from '../../utils';

export default function ListItem({ item }) {
    return (
        <Card>
            {item.imageDto && (
                <Image
                    src={base64ImageStringToImageSrc(
                        item.imageDto.base64Image,
                        item.imageDto.mimeType
                    )}
                    wrapped
                    ui={false}
                />
            )}
            <Card.Content>
                <Card.Header>{item.name}</Card.Header>
                <Card.Meta></Card.Meta>
                <Card.Description>
                    <p>Asukoht: {item.itemLocation.name}</p>
                    <p>Seerianumber: {item.serialNumber}</p>
                    <p>Kaal: {item.weight ? `${item.weight} kg` : ''}</p>
                    <p>Seisukord: {item.itemCondition?.condition}</p>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button
                    floated="right"
                    content="Detailid"
                    as={Link}
                    to={`/details/${item.id}`}
                />
            </Card.Content>
        </Card>
    );
}
