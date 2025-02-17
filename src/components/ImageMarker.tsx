import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Circle, Text } from 'react-konva';
import useImage from 'use-image';

type Mark = {
  id: string;
  x: number;
  y: number;
  description: string;
};

type ImageMarkerProps = {
  imageUrl: string;
  marks: Mark[];
  onAddMark?: (mark: Mark) => void;
  onRemoveMark?: (id: string) => void;
  readOnly?: boolean;
};

function ImageMarker({ imageUrl, marks, onAddMark, onRemoveMark, readOnly = false }: ImageMarkerProps) {
  const [image] = useImage(imageUrl);
  const [selectedMark, setSelectedMark] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const stageRef = useRef<any>(null);

  const handleStageClick = (e: any) => {
    if (readOnly) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    if (point && onAddMark) {
      const newMark = {
        id: Date.now().toString(),
        x: point.x,
        y: point.y,
        description: description || 'Defeito'
      };
      onAddMark(newMark);
      setDescription('');
    }
  };

  const handleMarkClick = (id: string) => {
    if (readOnly) return;
    if (selectedMark === id) {
      setSelectedMark(null);
      onRemoveMark?.(id);
    } else {
      setSelectedMark(id);
    }
  };

  if (!image) return null;

  const scale = Math.min(600 / image.width, 400 / image.height);

  return (
    <div>
      {!readOnly && (
        <div className="mb-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição do defeito"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      )}
      <Stage
        ref={stageRef}
        width={image.width * scale}
        height={image.height * scale}
        onClick={handleStageClick}
        className="border rounded-lg"
      >
        <Layer>
          <Image
            image={image}
            width={image.width * scale}
            height={image.height * scale}
          />
          {marks.map((mark) => (
            <React.Fragment key={mark.id}>
              <Circle
                x={mark.x}
                y={mark.y}
                radius={8}
                fill="red"
                opacity={0.6}
                onClick={() => handleMarkClick(mark.id)}
              />
              <Text
                x={mark.x + 10}
                y={mark.y - 10}
                text={mark.description}
                fontSize={12}
                fill="red"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default ImageMarker;