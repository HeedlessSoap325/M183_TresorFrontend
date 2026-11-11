
import '../../App.css';
import React, { useEffect, useState } from 'react';
import {
    deleteSecret,
    getSecretsforUser,
    updateSecret
} from "../../comunication/FetchSecrets";
import { Button } from 'reactstrap';
import { useUser } from '../../context/UserContext';
import { SecretModel } from '../../types/models';

const Secrets = () => {
    const { user } = useUser();

    const [secrets, setSecrets] = useState<SecretModel[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState<boolean>(false);

    async function fetchSecrets() {
        setErrorMessage("");

        if (!user?.email) {
            setErrorMessage("No valid email, please do login first.");
            return;
        }

        try {
            const data = await getSecretsforUser({ email: user?.email, encryptPassword: user?.password || "" });
            setSecrets(data);
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchSecrets();
    }, [user]);

    function handleEdit(secret: SecretModel) {
        setEditingId(secret.id);
        setEditContent(JSON.parse(secret.content));
        setErrorMessage("");
    };

    async function handleSave(secretId: number) {
        setErrorMessage("");
        setSaving(true);

        try {
            await updateSecret(
                secretId,
                { 
                    email: user?.email || "", 
                    encryptPassword: user?.password || "",
                    content: editContent,
                }
            );

            setEditingId(null);
            setEditContent({});
            await fetchSecrets();
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    async function handleDeleteSecret(secretId: number) {
        if (!window.confirm('Delete this secret?')) return;

        try {
            await deleteSecret(secretId);
            await fetchSecrets();
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    function handleChange(field: string, value: string) {
        setEditContent(previous => ({
            ...previous,
            [field]: value
        }));
    };

    return (
        <main>
            <h1>My Secrets</h1>

            {errorMessage && (
                <p style={{ color: 'red' }}>{errorMessage}</p>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Secret ID</th>
                        <th>User ID</th>
                        <th>Content</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {secrets?.length > 0 ? (
                        secrets.map(secret => {
                            const content = JSON.parse(secret.content);
                            const isEditing = editingId === secret.id;

                            const knownFields: {credential: string[][], note: string[][], creditcard: string[][]} = {
                                credential: [
                                    ['Username', 'userName', 'text'],
                                    ['Password', 'password', 'password'],
                                    ['URL', 'url', 'url']
                                ],
                                note: [
                                    ['Title', 'title', 'text'],
                                    ['Content', 'content', 'textarea']
                                ],
                                creditcard: [
                                    ['Type', 'cardtype', 'text'],
                                    ['Card number', 'cardnumber', 'text'],
                                    ['Expiration', 'expiration', 'text'],
                                    ['CVV', 'cvv', 'password']
                                ]
                            };
                            const fields: string[] = knownFields[content["kind"]] || [];
                            console.log(content);

                            return (
                                <tr key={secret.id}>
                                    <td>{secret.id}</td>
                                    <td>{secret.userId}</td>

                                    <td>
                                        {fields.length > 0 ? (
                                            fields.map(([label, field, type]) => (
                                                <div
                                                    key={field}
                                                    style={{ marginBottom: '10px' }}
                                                >
                                                    <strong>{label}: </strong>

                                                    {isEditing ? (
                                                        type === 'textarea' ? (
                                                            <textarea
                                                                value={editContent[field] ?? ''}
                                                                onChange={e =>
                                                                    handleChange(
                                                                        field,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                rows={3}
                                                                style={{
                                                                    display: 'block',
                                                                    width: '100%',
                                                                    boxSizing: 'border-box'
                                                                }}
                                                            />
                                                        ) : (
                                                            <input
                                                                type={type}
                                                                value={editContent[field] ?? ''}
                                                                onChange={e =>
                                                                    handleChange(
                                                                        field,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                style={{
                                                                    width: '100%',
                                                                    boxSizing: 'border-box'
                                                                }}
                                                                autoComplete="off"
                                                            />
                                                        )
                                                    ) : (
                                                        <span style={{
                                                            whiteSpace: 'pre-wrap',
                                                            overflowWrap: 'anywhere'
                                                        }}>
                                                            {content[field] ?? '—'}
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div>
                                                <span>Unknown secret type</span>
                                                <span>{secret.content}</span>
                                            </div>
                                        )}
                                    </td>

                                    <td>
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    color="success"
                                                    disabled={saving}
                                                    onClick={() => handleSave(secret.id)}
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </Button>{' '}

                                                <Button
                                                    color="secondary"
                                                    disabled={saving}
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setEditContent({});
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                color="primary"
                                                disabled={editingId !== null}
                                                onClick={() => handleEdit(secret)}
                                            >
                                                Edit
                                            </Button>
                                        )}

                                        {' '}

                                        <Button
                                            color="danger"
                                            onClick={() => handleDeleteSecret(secret.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={4}>No secrets available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </main>
    );
};

export default Secrets;
