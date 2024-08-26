"use client"
import Prose from "@/components/Base/Prose";
import { BaseTag } from "@shuriken-ui/react";
import Route from "@/lib/client/createEntity/Route";
import { Note } from "./constants";
import { useEntity, useEntityDispatch } from "./contexts";
import { NoteForm } from "./NoteForm";
import NotesPage from "./page";

export const Container = () => {
    const state = useEntity();
    const dispatch = useEntityDispatch();

    return (
        <>
            <Route
                renderEntityModalTitle={(e: Note) => (
                    <>
                        <span className="flex mb-2 gap-2 flex-nowrap  items-start overflow-x-auto py-1 leading-normal">
                            {e.tags?.map((e) => (
                                <div key={e} className="cursor-pointer flex-shrink-0">
                                    <BaseTag
                                        // onClick={() => {
                                        //   dispatch({
                                        //     type: "setTags",
                                        //     payload: Array.from(new Set(filters.tags.concat(e))),
                                        //   });
                                        // }}
                                        key={e}
                                        size="sm"
                                        variant="outline"
                                        color="primary"
                                    >
                                        {e}
                                    </BaseTag>
                                </div>
                            ))}
                        </span>
                        {
                            <time className="text-xs text-slate-600">
                                {new Date(e.id).toLocaleDateString()}
                            </time>
                        }
                    </>
                )}
                renderEntity={(e: Note, { preview }) => (
                    <div>
                        {preview && (
                            <div className="-mb-3 flex gap-2 flex-nowrap  items-start overflow-x-auto">
                                {e.tags?.map((e) => (
                                    <div key={e} className="cursor-pointer flex-shrink-0">
                                        <BaseTag
                                            // onClick={() => {
                                            //   dispatch({
                                            //     type: "setTags",
                                            //     payload: Array.from(new Set(filters.tags.concat(e))),
                                            //   });
                                            // }}
                                            key={e}
                                            size="sm"
                                            variant="outline"
                                            color="primary"
                                        >
                                            {e}
                                        </BaseTag>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Prose content={e.content}></Prose>
                    </div>
                )}
                state={state}
                dispatch={dispatch}
                RootPage={NotesPage}
                basename={"/notes"}
                createForm={NoteForm}
                updateForm={NoteForm}
            ></Route>
        </>
    );
};