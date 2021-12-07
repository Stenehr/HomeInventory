import { Grid, Segment } from "semantic-ui-react";

export default function NotFound() {
    return (
        <Grid centered>
            <Grid.Column computer='8' tablet='16'>
                <Segment>
                    Kahjuks me ei leidnud ressurssi, mida otsisite.
                </Segment>
            </Grid.Column>
        </Grid>
    )
}