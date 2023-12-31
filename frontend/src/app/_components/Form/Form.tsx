'use client';
import React from 'react';

import { GitHub, Figma } from 'react-feather';
import { useMutation, useQueryClient } from 'react-query';

import { Button, CircleBtn } from '../Button';
import { Input, Textarea } from '../Form';

const createMsg = async (msg: { name: string; message: string }) => {
  const response = await fetch(process.env.API_URL || 'http://localhost:9090/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  });
  if (!response.ok) throw Error('Cannot create new message!');
  return response.json();
};

export const Form: React.FC = () => {
  const queryClient = useQueryClient();
  const [author, setAuthor] = React.useState('');
  const [message, setMessage] = React.useState('');

  const { mutateAsync: addMsg } = useMutation(createMsg, {
    onSuccess: () => queryClient.invalidateQueries('messages'),
  });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data = { name: author, message: message };
    addMsg(data).then(() => {
      setAuthor('');
      setMessage('');
    });
  };

  return (
    <form autoComplete="off" onSubmit={onSubmit} className="flex flex-col">
      <Input placeholder="Author" value={author} onChange={setAuthor} required />
      <Textarea placeholder="Message" value={message} onChange={setMessage} required></Textarea>
      <div className="flex flex-row justify-between">
        <div>
          <CircleBtn icon={<GitHub size={20} />} className="mr-2 hover:bg-pink" link="/" />
          <CircleBtn icon={<Figma size={20} />} className="hover:bg-green" link="/" />
        </div>
        <Button type="submit" label="Post" className="bg-yellow" />
      </div>
    </form>
  );
};
