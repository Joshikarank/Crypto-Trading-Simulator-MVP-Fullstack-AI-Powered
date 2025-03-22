from mido import Message, MidiFile, MidiTrack

# Create a MIDI file
mid = MidiFile()
track = MidiTrack()
mid.tracks.append(track)

# Set tempo
track.append(Message('control_change', channel=0, control=7, value=100))  # Volume

# Für Elise melody notes (A minor)
melody_notes = [
    76, 75, 76, 75, 76, 71, 74, 72, 69,  # E - D# - E - D# - E - B - D - C - A
    67, 69, 71, 72, 64,  # G - A - B - C - E (Left-hand bass)
    69, 72, 76, 78, 79,  # A - C - E - G - A
    71, 74, 76, 72,  # B - D - E - C
    67, 69, 71, 72  # G - A - B - C
]

durations = [240] * len(melody_notes)  # Uniform note duration

# Generate the melody
for note, duration in zip(melody_notes, durations):
    track.append(Message('note_on', note=note, velocity=90, time=0))
    track.append(Message('note_off', note=note, velocity=90, time=duration))

# Save MIDI file
mid.save('fur_elise_melody.mid')

print("MIDI file saved: fur_elise_melody.mid")
