import React from 'react';

const DependencyModeModal = ({ story, onCancel }) => {
  const { id, description, weight } = story;
  return (
    <div className=" fixed right-0 w-full bottom-0 px-12 py-3 bg-transparent text-white ">
      <div className="w-3/5 mx-auto bg-teal-800 px-10 py-3 shadow-lg">
        <div className="font-semibold">Choose another story to add dependency for:</div>
        <div className="text-sm mt-2 flex flex-row justify-between">
          <div className="flex flex-row items-start">
            <div className="tag mr-2 rounded-lg">{id}</div>
            <div>
              <div>{description}</div>
              <div>Story Points: {weight}</div>
            </div>
          </div>
          <div>
            <button className="btn btn-minimal" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyModeModal;
