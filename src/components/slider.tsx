import React, { ChangeEvent } from "react";
import { Slider, Typography } from "@material-ui/core";
import { Method } from "@testing-library/react";

type Props = {
    step: number,
    max: number,
    min: number,
    name: string,
    value?: number,
    onChange: Function,
}

type State = {
    value: number,
    scaledValue: number,
}

export default class TestSlider extends React.Component<Props, State> {
    min: number;
    max: number;
    step: number;
    name: string;
    onChange: Function;

    constructor(props: Props) {
        super(props);

        this.max = props.max;
        this.min = props.min;
        this.name = props.name;
        this.step = props.step;
        this.onChange = props.onChange;

        if (props.value === undefined) {
            this.state = { value: 0, scaledValue: 0 };
        }
        else {
            this.state = { value: props.value ?? 0, scaledValue: this.scale(props.value) };
        }

        this.scale = this.scale.bind(this);
    }

    handleChange(event: ChangeEvent<{}>, val: number) {
        if (val === null) {
            return;
        }

        var scaled = this.scale(val);
        this.setState({ value: val, scaledValue: scaled });
        this.onChange(scaled);
    };

    scale(val: number): number {
        if (val === null) {
            return 0;
        }
        var aux = (this.max - this.min) / 2;
        var scaled = val / aux - 1;
        return scaled;
    }

    render(): React.ReactNode {
        return (
            <div>
                <Typography id="discrete-slider" gutterBottom>
                    {this.name} {this.state.scaledValue}
                </Typography>
                <Slider
                    value={this.state.value}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={this.step}
                    min={0}
                    max={this.max}
                    name={this.name}
                    onChange={(e, val) => this.handleChange(e, val as number)}
                    className="my-slider"
                    track={false}
                    scale={this.scale}
                />
            </div>
        );
    }
};