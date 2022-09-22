import React, { useEffect } from 'react'
import { useState } from 'react'
import "./styles.scss"


export const ChipsInput = (props) => {
    const { value: chips, onChange: setChips} = props;
    const [chip, setChip] = useState('')
    const [error, setError] = useState(false)


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (chips.length && e.key === 'Delete') {
                const filteredChips = chips.filter((el) => !el.selected);
                setChips(filteredChips);
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [chips, setChips]);


    const onKeyUp = (e) => {
        if (e.key === ',') {
            let quotes = 0;
            chip.split('').forEach(value => {
                if (value === '"') {
                    quotes += 1
                }
            })
            if (quotes % 2 === 0 || quotes === 0) {
                if (chip.length > 1) {
                    setChips(prevState => [
                        ...prevState,
                        {
                            id: Date.now(),
                            text: chip.substring(0, chip.length - 1),
                            selected: false,
                        }
                    ])
                    setError(false)
                }
                setChip('')
            }
        }
    }

    const onBlur = () => {
        let quotes = 0;

        chip.split('').forEach(value => {
            if (value === '"') {
                quotes += 1;
            }
        });

        if (quotes % 2 === 0) {
            if (chip.length > 0) {
                setChips(prevState => [
                    ...prevState,
                    {
                        text: chip,
                        id: Date.now(),
                        selected: false,
                    },
                ]);
                setError(false)
            }

            setChip('');
        } else {
            setError(true);
        }
    }


    const deleteHendler = (id) => setChips(chips.filter((el) => el.id !== id));

    const editChipHandler = (id) => {
        const editableChip = chips.find((el) => el.id === id);

        if (!editableChip?.text) {
            const filteredChips = chips.filter((el) => el.id !== id);
            setChips(filteredChips);
            return;
        }

        if (editableChip?.text.includes(",")) {
            const splitedChips = editableChip.text.split(',');
            const filteredChip = chips.filter((el) => el.id !== id);
            setChips(filteredChip);

            splitedChips.forEach((el) => {
                if (el.length) {
                    setChips(prevState => [
                        ...prevState,
                        {
                            id: Math.floor(Math.random() * 10000000),
                            text: el,
                            selected: false,
                        }])
                }
            })
        }
    }

    const onMouseEnter = (id, event) => {
        if (event.buttons === 1) {
            const newChips = chips.map((el) => {
                console.log(el);
                if (el.id === id) {
                    el.selected = true;
                    return el;
                }
                return el;
            })

            setChips(newChips);
        }
    }

    return (
        <div>
            <div className="chips_wrapper">
                <div className="chips">
                    {chips.map(({ id, text, selected }) => (
                        <div className={`chip ${selected && "selected"}`} key={id} onMouseEnter={(event) => onMouseEnter(id, event)}>
                            <input
                                value={text}
                                onBlur={() => editChipHandler(id)}
                                onChange={(event) => {
                                    const newChips = chips.map(value => {
                                        if (value.id === id) {
                                            value.text = event.target.value
                                            return value;
                                        } else {
                                            return value;
                                        }
                                    })
                                    setChips(newChips);
                                }}
                            />
                            <div onClick={() => { deleteHendler(id) }}>&times; </div>
                        </div>

                    ))}

                    <div>
                        <input
                            className="main_input"
                            placeholder='Введите ключевые слова'
                            value={chip}
                            onKeyUp={onKeyUp}
                            onChange={(e) => {
                                setChip(e.target.value)
                            }}
                            onBlur={onBlur}
                            onKeyDown={(e) => {
                                if (e.key === "x" && !chip && chips.length) {
                                    const filteredChips = chips.slice(0, chips.length - 1);
                                    setChips(filteredChips);
                                }
                            }}
                        />

                    </div>
                </div>
            </div>
            <div>
                {error && "Закройте кавычки с двух сторон"}
            </div>

        </div>
    )
}
